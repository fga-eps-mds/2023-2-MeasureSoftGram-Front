import React, { useState, useCallback, useEffect } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { Characteristic, Measure, Subcharacteristic } from '@customTypes/preConfig';
import CheckboxButton from '@components/CheckboxButton/CheckboxButton';
import titleFormater from '@utils/titleFormater';
import toPercentage from '../../utils/toPercentage';
import PreConfigSliders from '../PreConfigSliders';
import PreConfigTabs from '../PreConfigTabs';
import { iterator, iteratorType } from '../../utils/iterators';
import { componentIterator } from '../../utils/componentIterator';

export const titleAndSubTitle = {
  title: 'Preencher pré configurações',
  subtitle: 'Mini explicação do que é caracteristica e como esse formulário pode demorar um tempo para ser preenchido'
};

interface PreConfigTypes {
  data: Characteristic[];
  type: iteratorType;
  onChange: Function;
  setCheckboxValues: Function;
  checkboxValues: string[];
  tabs?: string[];
}
type limiterType = { tabName?: string; data: { key: string; weight: number } };
const PERCENTAGE = 100;

const ConfigForm = ({ onChange, data, type, checkboxValues, setCheckboxValues, tabs }: PreConfigTypes) => {
  const [tabValue, setTabValue] = useState<string>('');
  const [limiters, setLimiters] = useState<[limiterType] | []>([]);

  useEffect(() => {
    if (limiters) setLimiters([]);
  }, [type]);

  useEffect(() => {
    if (tabs) setTabValue(tabs[0]);
  }, [tabs]);

  const keyGetter = (objectArray: [limiterType] | []) => objectArray.map((object) => object.data.key);

  const weightArrayHandler = (key: string, weight: number) => {
    const index = keyGetter(limiters).indexOf(key);
    limiters[index].data.weight = weight;

    setLimiters(limiters);
  };

  const setWeight = (key: string, tabName?: string) => (event: any) => {
    const currentWeight = toPercentage(event.target.value);

    let weightSumExeceptCurrent = 0;

    limiters.forEach((limiter) => {
      if (limiter.tabName === tabName && limiter.data.key !== key) {
        weightSumExeceptCurrent += limiter.data.weight;
      }
    });

    const limit = PERCENTAGE - weightSumExeceptCurrent;

    if (currentWeight <= limit) {
      onChange(iterator[type]({ data, key, weight: currentWeight }));
      weightArrayHandler(key, currentWeight);
    }
  };

  const checkboxValue = useCallback(
    (key: string) => {
      let namesArray = [...checkboxValues];

      if (checkboxValues.includes(key)) {
        namesArray = namesArray.filter((name) => name !== key);
      } else namesArray.push(key);

      setCheckboxValues(namesArray);
    },
    [checkboxValues, setCheckboxValues]
  );

  const checkBoxCallback = (
    value: Measure | Characteristic | Subcharacteristic,
    previousValue: Characteristic | Subcharacteristic
  ) => {
    if (previousValue?.key === tabValue || !previousValue) {
      const isChecked = checkboxValues.includes(value.key);
      return (
        <Grid item>
          <CheckboxButton
            label={titleFormater(value.key)}
            checked={isChecked}
            style={{ marginRight: '8px' }}
            onClick={() => {
              checkboxValue(value.key);
              const index = keyGetter(limiters).indexOf(value.key);
              if (!(index < 0)) {
                limiters.splice(index, 1);
                setLimiters(limiters);
              }
            }}
          />
        </Grid>
      );
    }
  };

  const renderCheckBoxes = () => (
    <Grid container marginBottom="64px" columns={4}>
      {componentIterator[type](data, checkBoxCallback)}
    </Grid>
  );

  const renderSliderCallback = (
    value: Measure | Characteristic | Subcharacteristic,
    previousValue: Characteristic | Subcharacteristic
  ) => {
    if (checkboxValues.includes(value.key) && (!previousValue || previousValue.key === tabValue)) {
      const tabName = previousValue?.key;

      if (keyGetter(limiters).indexOf(value.key) < 0) {
        limiters.push({ tabName, data: { key: value.key, weight: value.weight } } as limiterType as never);
        setLimiters(limiters);
      }

      return <PreConfigSliders label={value.key} weight={value.weight} onChange={setWeight(value.key, tabName)} />;
    }
  };

  const renderSliders = () => <Box>{componentIterator[type](data, renderSliderCallback)}</Box>;

  const setTab = (_e: any, newValue: string) => {
    setTabValue(newValue);
  };

  const renderTabs = () => {
    if (tabs)
      return <PreConfigTabs style={{ marginBottom: '24px' }} onChange={setTab} value={tabValue} tabsValues={tabs} />;
  };

  return (
    <Box display="flex" flexDirection="column" mt="10vh">
      <Typography variant="h6" sx={{ marginBottom: '16px' }}>
        Preencher pré configurações
      </Typography>
      {renderTabs()}
      {renderCheckBoxes()}
      {renderSliders()}
    </Box>
  );
};

export default ConfigForm;

import React from 'react';
import ReactEcharts from 'echarts-for-react';

import formatCharacteristicsHistory from '@utils/formatCharacteristicsHistory';
import formatMsgramChart from '@utils/formatMsgramChart';
import { Alert, Box, Fade, Skeleton } from '@mui/material';
import { useRequestValues } from '@hooks/useRequestValues';

interface Prop {
  title: string;
  type: 'line' | 'msg';
  value: 'characteristics' | 'subcharacteristics' | 'measures' | 'metrics';
  addHistoricalSQC?: boolean;
}

const GraphicChart = ({ title, type, value, addHistoricalSQC = false }: Prop) => {
  const {
    data: historical,
    error,
    isLoading,
    isEmpty,
  } = useRequestValues({ type: 'historical-values', value, addHistoricalSQC });

  const chartOption: Function = type === 'line'
    ? formatCharacteristicsHistory
    : formatMsgramChart;

  let chartBoxHeight: string = 'auto';
  if (error || isEmpty) {
    chartBoxHeight = '50px';
  } else if (type === 'msg') {
    chartBoxHeight = `${historical.length * 82 + 85}px`
  }

  return isLoading ? (
    <Skeleton variant="rectangular" height="300px" sx={{ marginTop: '20px' }} />
  ) : (
    <>
      <Fade in timeout={2000}>
        <Box
          bgcolor="white"
          borderRadius="4px"
          boxShadow="0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)"
          paddingX="20px"
          paddingY="10px"
          width="100%"
          height={chartBoxHeight}
          marginTop="20px"
        >
          <ReactEcharts
            data-testid="graphic-stacked-line"
            option={chartOption({
              historical,
              title,
              isEmpty: !!error || isEmpty
            })}
          />
        </Box>
      </Fade>
      {error && (
        <Fade in timeout={1000}>
          <Alert severity="error">Ocorreu um erro ao tentar carregar as informações</Alert>
        </Fade>
      )}
      {isEmpty && (
        <Fade in timeout={1000}>
          <Alert variant="standard" severity="warning">
            Não há dados para serem exibidos
          </Alert>
        </Fade>
      )}
    </>
  );
};

export default GraphicChart;

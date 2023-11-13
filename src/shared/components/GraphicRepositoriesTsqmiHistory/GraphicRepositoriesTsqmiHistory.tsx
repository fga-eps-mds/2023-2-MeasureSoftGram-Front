import React from 'react';

import formatRepositoriesTsqmiHistory from '@utils/formatRepositoriesTsqmiHistory';
import { RepositoriesTsqmiHistory } from '@customTypes/product';

import ReactEcharts from 'echarts-for-react';
import * as Styles from './styles';
import convertToCsv from '@utils/convertToCsv';
import { Box, Button, IconButton } from '@mui/material';
import { AiOutlineCloudDownload } from 'react-icons/ai';

interface Props {
  history: RepositoriesTsqmiHistory | undefined;
}

const GraphicRepositoriesTsqmiHistory = ({ history }: Props) => {
  if (!history) {
    return null;
  }

  const results = history.results;

  const handleExportCsv = () => {
    if (results) {
      const csvContent = convertToCsv(results);

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'dados.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const formatedOptions = formatRepositoriesTsqmiHistory(history);

  return (
    <>
      <Styles.GraphicContainer>
        <ReactEcharts option={formatedOptions} style={{ height: '450px', width: '100%' }} />
      </Styles.GraphicContainer>
    </>
  );
};

export default GraphicRepositoriesTsqmiHistory;

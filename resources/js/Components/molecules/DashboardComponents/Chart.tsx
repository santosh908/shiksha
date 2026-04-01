import React, { useState, useEffect } from 'react';
import ApexCharts from 'react-apexcharts';

const Chart = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // or a loading spinner, or placeholder component
  }

  //return <ApexCharts /* your chart props here */ />;
};

export default Chart;
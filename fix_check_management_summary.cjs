const fs = require('fs');
let file = fs.readFileSync('src/components/financial/CheckManagement.tsx', 'utf8');

file = file.replace(/  \/\/ Calculations for KPIs[\s\S]*?const bouncedReceivedAmount =[^;]+;/g, `
  const { data: summaryData } = useQuery({
    queryKey: ['checksSummary'],
    queryFn: getChecksSummary,
    refetchInterval: 60000,
  });

  const getSum = (stats, statuses) => {
    if (!stats) return 0;
    return stats.filter(s => statuses.includes(s.status)).reduce((sum, s) => sum + s.totalAmount, 0);
  };

  const totalIssuedAmount = summaryData?.issuedStats ? summaryData.issuedStats.reduce((sum, s) => sum + s.totalAmount, 0) : 0;
  const cashedIssuedAmount = getSum(summaryData?.issuedStats, ['cashed']);
  const pendingIssuedAmount = getSum(summaryData?.issuedStats, ['issued']);
  const bouncedIssuedAmount = getSum(summaryData?.issuedStats, ['bounced']);

  const totalReceivedAmount = summaryData?.receivedStats ? summaryData.receivedStats.reduce((sum, s) => sum + s.totalAmount, 0) : 0;
  const cashedReceivedAmount = getSum(summaryData?.receivedStats, ['cashed']);
  const inHandReceivedAmount = getSum(summaryData?.receivedStats, ['received']);
  const bouncedReceivedAmount = getSum(summaryData?.receivedStats, ['bounced', 'bounced_assigned']);
`);

fs.writeFileSync('src/components/financial/CheckManagement.tsx', file);

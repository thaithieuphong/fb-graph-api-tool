import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';

const BarChartComponent = () => {
    return (
        <>
            <BarChart xAxis={[
                {
                    id: 'barCategories',
                    data: ['bar A', 'bar B', 'bar C'],
                },
            ]}
                series={[
                    {
                        data: [2, 5, 3],
                    },
                ]}
                height={300}
                className='text-gray-300'
            />
        </>
    )
}

export default BarChartComponent
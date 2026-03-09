import { calculateInvestmentResults, formatter } from '../../utils/investment';

type ResultsTypes = {
    input: {
        initialInvestment: number;
        annualInvestment: number;
        expectedReturn: number;
        duration: number;
    };
};

export default function Results({ input }: ResultsTypes) {
    const resultsData = calculateInvestmentResults(input);
    const { valueEndOfYear, interest, annualInvestment } = resultsData[0];
    const initialInvestment = valueEndOfYear - interest - annualInvestment;

    return (
        <table id="result">
            <thead>
                <tr>
                    <th>Year</th>
                    <th>Investment Value</th>
                    <th>Interest (Year)</th>
                    <th>Total Interest</th>
                    <th>Invested Capital</th>
                </tr>
            </thead>
            <tbody>
                {resultsData.map((yearData) => {
                    const totalInterest =
                        yearData.valueEndOfYear - yearData.annualInvestment * yearData.year - initialInvestment;
                    const totalAmountInvested = yearData.valueEndOfYear - totalInterest;

                    return (
                        <tr key={yearData.year}>
                            <td>{yearData.year}</td>
                            <td>{formatter.format(yearData.valueEndOfYear)}</td>
                            <td>{formatter.format(yearData.interest)}</td>
                            <td>{formatter.format(totalInterest)}</td>
                            <td>{formatter.format(totalAmountInvested)}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

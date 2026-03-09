const logo =
    'https://s3.eu-central-1.amazonaws.com/assets.reactjs-component-lib.eu/images/investment-calculator-logo-original.webp';

export default function Header() {
    return (
        <header id="header">
            <img src={logo} alt="Logo showing a money bag" />
            <h1>Investment Calculator</h1>
        </header>
    );
}

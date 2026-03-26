import { faker } from '@faker-js/faker';
import './App.scss';

// import Base from './cases/Base';
// import Pagination from './cases/Pagination';
// import InfiniteScrollComponent from './cases/InfiniteScroll';
import ReactVirtualized from './cases/ReactVirtualized';
// import ReactWindow from './cases/ReactWindow';
// import ReactViewPortList from './cases/ReactViewPortList';

const data = Array.from({ length: 10000 }, (_, index) => ({
    id: index,
    title: faker.lorem.words(5),
    body: faker.lorem.sentences(4),
}));

function App() {
    return (
        <div className="App">
            {/* <Base data={data} /> */}
            {/* <Pagination data={data} /> */}
            {/* <InfiniteScrollComponent data={data} /> */}
            <ReactVirtualized data={data} />
            {/* <ReactWindow data={data} /> */}
            {/* <ReactViewPortList data={data} /> */}
        </div>
    );
}
export default App;

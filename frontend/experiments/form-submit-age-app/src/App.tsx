// import { Demo as DemoCard } from './components/ExamplePolymorphicComponents/Card.tsx';
// import { Demo as DemoIconButton } from './components/ExamplePolymorphicComponents/IconButton.tsx';
// import { Demo as DemoList } from './components/ExamplePolymorphicComponents/List.tsx';

import { useRef } from 'react';

import Input from './components/Input.tsx';
import Form, { type FormHandle } from './components/Form.tsx';
import Button from './components/Button.tsx';

function App() {
    const customFormRef = useRef<FormHandle>(null);

    function handleSave(data: unknown) {
        const extractedData = data as { name: string; age: string };
        console.log(extractedData);
        customFormRef.current?.clear();
    }

    return (
        <main>
            <Form onSave={handleSave} ref={customFormRef}>
                <Input type="text" label="Name" id="name" />
                <Input type="number" label="Age" id="age" />
                <p>
                    <Button>Save</Button>
                </p>
            </Form>

            {/* <DemoCard />
            <DemoIconButton />
            <DemoList /> */}
        </main>
    );
}

export default App;

import { emptyFieldGenerator, Field, CellState, fieldGenerator } from './Field';

const { empty, bomb } = CellState;

describe('Field generator', () => {
    describe('emptyFieldGenerator test', () => {
        // GOOD WEATHER TEST
        it('should return a 2 x 2 field with empty cells', () => {
            const SUT = emptyFieldGenerator;
            const actual: Field = SUT(2);
            const expected: Field = [
                [empty, empty],
                [empty, empty],
            ];

            expect(actual).toEqual(expected);
        });

        it('should return a 3 x 3 field with empty cells', () => {
            const SUT = emptyFieldGenerator;
            const actual: Field = SUT(3);
            const expected: Field = [
                [empty, empty, empty],
                [empty, empty, empty],
                [empty, empty, empty],
            ];

            expect(actual).toEqual(expected);
        });

        // BAD WEATHER TEST
        it('should return a 0 x 0 field with empty cells', () => {
            const SUT = emptyFieldGenerator;
            const actual: Field = SUT(0);
            const expected: Field = [];

            expect(actual).toEqual(expected);
        });
    });

    describe('fieldGenerator test', () => {
        // BAD WEATHER TEST
        it('should throw an error when probability is less than 0', () => {
            const SUT = fieldGenerator;
            const actual = () => SUT(2, -1);
            expect(actual).toThrow('Probability must be between 0 and 1');
        });

        it('should have smallest possible field without mines', () => {
            const SUT = fieldGenerator;
            const actual: Field = SUT(1, 0);
            const expected: Field = [[empty]];
            expect(actual).toEqual(expected);
        });

        it('should have smallest possible field with mines', () => {
            const SUT = fieldGenerator;
            const actual: Field = SUT(1, 1);
            const expected: Field = [[bomb]];
            expect(actual).toEqual(expected);
        });

        it('should have a big filed without mines', () => {
            const SUT = fieldGenerator;
            const actual: Field = SUT(10, 0);
            const expected: Field = [
                [empty, empty, empty, empty, empty, empty, empty, empty, empty, empty],
                [empty, empty, empty, empty, empty, empty, empty, empty, empty, empty],
                [empty, empty, empty, empty, empty, empty, empty, empty, empty, empty],
                [empty, empty, empty, empty, empty, empty, empty, empty, empty, empty],
                [empty, empty, empty, empty, empty, empty, empty, empty, empty, empty],
                [empty, empty, empty, empty, empty, empty, empty, empty, empty, empty],
                [empty, empty, empty, empty, empty, empty, empty, empty, empty, empty],
                [empty, empty, empty, empty, empty, empty, empty, empty, empty, empty],
                [empty, empty, empty, empty, empty, empty, empty, empty, empty, empty],
                [empty, empty, empty, empty, empty, empty, empty, empty, empty, empty],
            ];
            expect(actual).toEqual(expected);
        });

        it('should have a 2 x 2 field with mines', () => {
            const SUT = fieldGenerator;
            const actual: Field = SUT(2, 1);
            const expected: Field = [
                [bomb, bomb],
                [bomb, bomb],
            ];
            expect(actual).toEqual(expected);
        });

        it('should have a 2 x 2 with 50% probability of having a mine', () => {
            const SUT = fieldGenerator;
            const actual: Field = SUT(2, 0.5);
            const cellsWithBombs = actual.flat().filter((cell) => cell === bomb);
            const emptyCells = actual.flat().filter((cell) => cell === 2);
            // console.table(actual);
            expect(cellsWithBombs.length).toBe(2);
            expect(emptyCells.length).toBe(2);
        });

        it('should have a 10 x 10 field with 10% probability of having a mine', () => {
            const SUT = fieldGenerator;
            const size = 10;
            const mines = 25;

            const probability = mines / (size * size);
            const actual: Field = SUT(size, probability);
            console.table(actual);

            const fieldFlat = actual.flat();
            const expectedMines = mines;

            expect(fieldFlat.filter((cell) => cell === bomb).length).toBe(expectedMines);
        });
    });
});

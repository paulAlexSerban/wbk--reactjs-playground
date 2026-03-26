import { add, subtract, multiply, divide } from './mathFunctions';
describe('Math functions test', () => {
    it('add', () => {
        expect(add(1, 2)).toBe(3);
    });

    it('subtract', () => {
        expect(subtract(2, 1)).toBe(1);
    });

    it('multiply', () => {
        expect(multiply(2, 3)).toBe(6);
    });

    it('divide', () => {
        expect(divide(6, 3)).toBe(2);
    });
});

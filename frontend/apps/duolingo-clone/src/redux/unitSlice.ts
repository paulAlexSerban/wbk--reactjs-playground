import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import ImageLesson1 from '../assets/two-people-talking.jpg';
import ImageLesson2 from '../assets/tapas-and-beer.jpg';
import ImageLesson3 from '../assets/travel.jpg';

/**
 * @typedef UnitUpdate
 * @property {number} id - The id of the unit to update.
 * @property {("enabled" | "finished")} state - The new state of the unit.
 */
type UnitUpdate = {
    id: number;
    // type is "enabled" or "finished", but not both
    // this is a union type
    // literal type
    state: 'enabled' | 'finished';
};

/**
 * @typedef LessonUpdate
 * @property {number} unitId - The id of the unit that contains the lesson to update.
 * @property {number} lessonId - The id of the lesson to update.
 * @property {("enabled" | "finished")} lessonState - The new state of the lesson.
 */
type LessonUpdate = {
    unitId: number;
    lessonId: number;
    lessonState: 'enabled' | 'finished';
};

/**
 * @typedef UnitState
 * @property {number} id - The unique identifier for the unit.
 * @property {string} title - The title of the unit.
 * @property {string} description - The description of the unit.
 * @property {boolean} enabled - Indicates if the unit is enabled.
 * @property {boolean} finished - Indicates if the unit is finished.
 * @property {Array} lessons - An array of lessons.
 * @property {number} lessons.id - The unique identifier for the lesson.
 * @property {string} lessons.title - The title of the lesson.
 * @property {string} lessons.description - The description of the lesson.
 * @property {string} lessons.avatar - The avatar for the lesson.
 * @property {boolean} lessons.enabled - Indicates if the lesson is enabled.
 * @property {boolean} lessons.finished - Indicates if the lesson is finished.
 * @property {Array} lessons.exercises - An array of exercises.
 * @property {string} lessons.exercises.title - The title of the exercise.
 * @property {string} lessons.exercises.question - The question of the exercise.
 * @property {Array} lessons.exercises.answers - An array of possible answers.
 * @property {string} lessons.exercises.answers.option - The text of the answer option.
 * @property {boolean} lessons.exercises.answers.valid - Indicates if the answer option is the correct one.
 */
export interface UnitState {
    id: number;
    title: string;
    description: string;
    enabled: boolean;
    finished: boolean;
    lessons: {
        id: number;
        title: string;
        description: string;
        avatar: string;
        enabled: boolean;
        finished: boolean;
        exercises: {
            title: string;
            question: string;
            answers: {
                option: string;
                valid: boolean;
            }[];
        }[];
    }[];
}

// Define the initial state
const initialState: UnitState[] = [
    {
        id: 1,
        title: 'Unit 1',
        description: 'Form basic sentences, greet people',
        enabled: true,
        finished: false,
        lessons: [
            {
                id: 1,
                title: 'Lesson 1',
                description: 'Introduce yourself!',
                avatar: ImageLesson1,
                enabled: true,
                finished: false,
                exercises: [
                    {
                        title: 'Read and Translate',
                        question: 'Hola, yo soy Pedro. Como te llamas?',
                        answers: [
                            {
                                option: 'Hey, I am Pedro. How are you?',
                                valid: false,
                            },
                            {
                                option: 'Hey, I am Pedro. What is your name?',
                                valid: true,
                            },
                            {
                                option: 'Hey, I am Pedro. How old are you?',
                                valid: false,
                            },
                        ],
                    },
                    {
                        title: 'Fill in the blank',
                        question: 'Soy Ana. Yo soy una ...',
                        answers: [
                            {
                                option: 'hombre',
                                valid: false,
                            },
                            {
                                option: 'mujer',
                                valid: true,
                            },
                            {
                                option: 'gato',
                                valid: false,
                            },
                        ],
                    },
                ],
            },
            {
                id: 2,
                title: 'Lesson 2',
                description: 'Order food and drinks',
                avatar: ImageLesson2,
                enabled: false,
                finished: false,
                exercises: [
                    {
                        title: 'Read and Translate',
                        question: 'Tu comes pan?',
                        answers: [
                            {
                                option: 'Do you eat bread?',
                                valid: true,
                            },
                            {
                                option: 'Does he eat bread?',
                                valid: false,
                            },
                            {
                                option: 'You are eating bread.',
                                valid: false,
                            },
                        ],
                    },
                    {
                        title: 'Fill in the blanks',
                        question: 'Yo ... agua. Tú ... leche',
                        answers: [
                            {
                                option: 'bebe / bebes',
                                valid: false,
                            },
                            {
                                option: 'bebes / bebo',
                                valid: false,
                            },
                            {
                                option: 'bebo / bebes',
                                valid: true,
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        id: 2,
        title: 'Unit 2',
        description: 'Get around the city',
        enabled: false,
        finished: false,
        lessons: [
            {
                id: 1,
                title: 'Lesson 1',
                description: 'Explore the city',
                avatar: ImageLesson3,
                enabled: false,
                finished: false,
                exercises: [
                    {
                        title: 'Fill in the blank',
                        question: 'Yo tengo una reserva en el ...',
                        answers: [
                            {
                                option: 'pan',
                                valid: false,
                            },
                            {
                                option: 'hotel',
                                valid: true,
                            },
                            {
                                option: 'coche',
                                valid: false,
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        id: 3,
        title: 'Unit 3',
        description: 'Talk about your family',
        enabled: false,
        finished: false,
        lessons: [
            {
                id: 1,
                title: 'Lesson 1',
                description: 'Talk about your family',
                avatar: ImageLesson3,
                enabled: false,
                finished: false,
                exercises: [
                    {
                        title: 'Fill in the blank',
                        question: 'Mi ... es muy grande',
                        answers: [
                            {
                                option: 'familia',
                                valid: true,
                            },
                            {
                                option: 'perro',
                                valid: false,
                            },
                            {
                                option: 'gato',
                                valid: false,
                            },
                        ],
                    },
                ],
            },
        ],
    },
];

/**
 * Creates a redux slice for managing units and their lessons.
 */
export const unitSlice = createSlice({
    name: 'units',
    initialState,
    reducers: {
        /**
         * Updates a unit's state.
         * @param {UnitState[]} state - The current state.
         * @param {PayloadAction<UnitUpdate>} action - The action payload.
         */
        updateUnit: (state, action: PayloadAction<UnitUpdate>) => {
            state.map((unit: any) => {
                if (unit[`${action.payload.state}`] || unit.id === action.payload.id) {
                    return (unit[`${action.payload.state}`] = true);
                }
                return (unit[`${action.payload.state}`] = false);
            });
        },
        /**
         * Updates a lesson's state.
         * @param {UnitState[]} state - The current state.
         * @param {PayloadAction<LessonUpdate>} action - The action payload.
         */
        updateLesson: (state, action: PayloadAction<LessonUpdate>) => {
            const unitIndex = state.findIndex((unit) => unit.id === action.payload.unitId);
            state[unitIndex].lessons.map((lesson: any) => {
                if (lesson[`${action.payload.lessonState}`] || lesson.id === action.payload.lessonId) {
                    return (lesson[`${action.payload.lessonState}`] = true);
                }
                return (lesson[`${action.payload.lessonState}`] = false);
            });
        },
    },
});

// Export the slice's actions
export const { updateUnit, updateLesson } = unitSlice.actions;

// Export the slice's reducer
export default unitSlice.reducer;

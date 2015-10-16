import pi from 'pi';

export default {
    getDigits: {
        pi(noteQuantity) {
            return pi(noteQuantity).replace('.', '');
        }
    }
};
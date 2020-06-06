/**
 * Class Utils
 */
class Utils {
    /**
     * Random functions
     */
    roundInt(num) {
        const result = Math.floor(num);

        if(isNaN(result)) return 0;
        else return result;
    }
    roundFloat(num, decimals = 2) {
        return Number(Math.round(num + 'e' + decimals) + 'e-' + decimals);
    }

    /**
     * Array functions
     */
    chunkItems(array, size) {
        const result = [];
        const length = array.length;

        for (let i = 0; i < length; i += size){
            result.push(array.slice(i, i + size));
        }

        return result;
    }
    getColumns(array, param) {
        const result = [];

        array.map((el) => {
            if (param in el) result.push(el[param]);
        });

        return result;
    }

    /**
     * Strings functions
     */
    declOfNum(number, t) {
        if(t.length === 2) t.push(t[1]);

        const cases = [2, 0, 1, 1, 1, 2];
        return t[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
    }
}

module.exports = new Utils();
const zip = (arrayA, arrayB) => {
    const shortestArrayLength = arrayA.length < arrayB.length ? arrayA.length : arrayB.length;
    const result = [];

    for (let index = 0; index < shortestArrayLength; index += 1) {
        result.push([arrayA[index], arrayB[index]]);
    }

    return result;
};

export default zip;

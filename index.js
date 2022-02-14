const bubbleSort = (arr) => {
    const len = arr.length - 1;
    for (var i = 0; i < len; i++) {
        for (var j = 0; j < len - i; j++) {
            if (arr[j] > arr[j + 1]) {
                var temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    console.log(arr);
}

const selectSort = (arr) => {
    let len = arr.length;
    for (let i = 0; i < len - 0; i++) {
        let index = i;
        for (let j = 0; j < len; j++) {
            if (arr[j] < arr[index]) {
                index = j;
            }
        }
        const temp = arr[i];
        arr[i] = arr[index];
        arr[index] = temp;
    }
}

const quickSort = (arr) => {
    if (arr.length <= 0) {
        return arr;
    }
    const index = Math.floor(arr.length / 2);
    const [center] = arr.splice(index, 1);
    const left = [];
    const right = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] < center) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
    return [...quickSort(left), center, ...quickSort(right)];
}

const bubbleSort =(arr) => {
    const len = arr.length - 1;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - i; j++) {
            if (arr[j] < arr[j+1]) {
                const temp
            }
        }
    }
}

const selectSort = (arr) => {
    let len = arr.length;
    for (let i = 0; i < len - 1; i++) {
        const index = i;
        for (let j = i + 1; j < len; j++) {
            if (arr[j] < arr[index]) {
                index = j;
            }
        }
        const temp = arr[i];
        arr[i] = arr[index];
        arr[index] = temp;
    }
}


console.log(quickSort([1, 2, 3, 1, 2, 5, 3]));



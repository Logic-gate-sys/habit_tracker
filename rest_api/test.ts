
// const numBinaries = (n: number) => {
//     let count: number = 0;
//     for (let i = 1; i <= n; i++){
//         const bin = i.toString(2).split("");
//         console.log("Binary: ", bin);
//         bin.map(n => {
//             if (Number(n) === 1) {
//                 count++;
//             }
//         })
        
//     }
//     return count;
// }

// console.log("Binary strings in : 1 - 6: ", numBinaries(5));


// const binSingle = (n: number, count=0) =>  { for (let i = 1; i <= n; i++)i.toString(2).split("").map(n=> Number(n)===1? count++: count)}

// console.log("Binary strings in : 1 - 4: ", binSingle(4));
var increase = parseInt(readLine(), 10);
var prices = [98.99, 15.2, 20, 1026];
//your code goes here
count = 0;
while (count < prices.length) {
    prices[count] += increase; 
    count++;
}
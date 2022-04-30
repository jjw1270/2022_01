#include <iostream>
using namespace std;

class Accumulator {
    int value;
public:
    Accumulator(int val) : value{val} { };
    Accumulator &add(int n);
    int get() { return value; }
};
Accumulator& Accumulator::add(int n){
    value += n;
    return *this;
}

int main() {
    Accumulator acc(10);
    cout << acc.get() << endl;  //10 Ãâ·Â

    acc.add(1).add(2).add(3);  //acc °´Ã¼ÀÇ value´Â 16ÀÌ µÊ.
    cout << acc.get() << endl; //16 Ãâ·Â
}
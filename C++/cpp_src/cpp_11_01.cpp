#include <iostream>
using namespace std;

class Test {
public:
    inline static int cnt = 10;
    static void print() { cout << cnt << endl; }
};

int main() {
    Test::print();
    Test::cnt = 7;
    Test t;
    t.print();
}
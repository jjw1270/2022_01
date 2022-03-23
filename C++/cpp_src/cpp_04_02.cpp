#include <iostream>
#include <string>
#include <cstdio>
#include <string_view>
using namespace std;

string_view untilFive(string_view str){
    return str.substr(0,5);
}

int main() {
    string stra, outstr;
    cout << "Enter a string: ";
    getline(cin, stra);

    outstr = untilFive(stra);
    cout << " -> " << outstr;

    char strb[50];
    cout << "\nEnter a string: ";
    gets(strb);
    outstr = untilFive(strb);
    cout << " -> " << outstr;

    return 0;
}
#include <iostream>
#include <string>          //¼÷Á¦
#include <cstdio>
#include <string_view>
using namespace std;

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

string_view untilFive(string_view stra){
    stra.substr(0,4);
    return stra;
}
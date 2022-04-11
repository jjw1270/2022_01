#include <iostream>
#include <array>
#include <algorithm>
using namespace std;

int main(){
    string str("This is a long string.");
int loc = str.find("is");
cout << str[loc] << endl;
cout << str.substr(loc) << endl;

}

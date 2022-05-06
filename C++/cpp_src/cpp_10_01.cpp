#include <iostream>
#include <string>
using namespace std;
//
// message_print() 함수를 구현합니다. //
void message_print(string&& str){
    cout << "message = " << str << endl;
}
int main()
{
    string stra = "apple";
    string strb = "banana";
    message_print(move(stra));
    message_print(stra + strb);
    return 0;
}
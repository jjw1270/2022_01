#include <iostream>
#include <string>
using namespace std;
//
// message_print() �Լ��� �����մϴ�. //
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
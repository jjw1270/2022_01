#include <iostream>
#include <iomanip>

using namespace std;

int main(){
    int num;
    
    cout << "10진수 입력 : ";
    cin >> num ;
    cout << "여러 진법으로 출력 하기" << "oct(8), hex(16), digit(10)" << endl;
    
    do{
        cout << "해당 진법 입력 : ";
        string data;
        cin >> data;
    
        if(data == "oct" || data == "8")
            cout << data << "진법 : "<< "0" << oct << num << endl;
        else if(data == "digit" || data == "10")
            cout << data << "진법 : "<< num << endl;
        else if(data == "hex" || data == "16")
            cout << data << "진법 : "<< "0x" << hex << num << endl;
        else{
            cout << "해당 진법이 없습니다." << endl;
            break;
        }
    }while(true);
    return(0);
}

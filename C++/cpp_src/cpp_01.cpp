#include <iostream>
#include <iomanip>

using namespace std;

int main(){
    int num;
    
    cout << "10���� �Է� : ";
    cin >> num ;
    cout << "���� �������� ��� �ϱ�" << "oct(8), hex(16), digit(10)" << endl;
    
    do{
        cout << "�ش� ���� �Է� : ";
        string data;
        cin >> data;
    
        if(data == "oct" || data == "8")
            cout << data << "���� : "<< "0" << oct << num << endl;
        else if(data == "digit" || data == "10")
            cout << data << "���� : "<< num << endl;
        else if(data == "hex" || data == "16")
            cout << data << "���� : "<< "0x" << hex << num << endl;
        else{
            cout << "�ش� ������ �����ϴ�." << endl;
            break;
        }
    }while(true);
    return(0);
}

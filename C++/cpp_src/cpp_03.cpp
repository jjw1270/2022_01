#include <iostream>
#include <iomanip>

using namespace std;
//review ����
int main(){
    char* pStr;
    int strCount = 0;

    do{
        cout << "���ڿ� �Է� : ";
        cin >> pStr;

        for(int i = 0; pStr[i] != '\0'; i++){
            strCount += 1;
        }

        cout << "���ڿ��� ���� : " << strCount << endl;
        strCount = 0;
    }while(true);
}
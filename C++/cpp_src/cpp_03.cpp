#include <iostream>
#include <iomanip>

using namespace std;
//review 문제
int main(){
    char* pStr;
    int strCount = 0;

    do{
        cout << "문자열 입력 : ";
        cin >> pStr;

        for(int i = 0; pStr[i] != '\0'; i++){
            strCount += 1;
        }

        cout << "문자열의 길이 : " << strCount << endl;
        strCount = 0;
    }while(true);
}
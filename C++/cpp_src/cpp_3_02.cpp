#include <iostream>
#include <iomanip>
using namespace std;
int main(){
    double num;

    cout << "실수를 입력하세요 : ";
    cin >> num;

    int intNum = static_cast<int>(num);
    double douNum = num - intNum;

    cout << "정수 파트 : " << intNum << endl;
    cout << "소수 파트 : " << douNum << endl;
}
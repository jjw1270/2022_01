#include <iostream>
#include <iomanip>
using namespace std;
int main(){
    double num;

    cout << "�Ǽ��� �Է��ϼ��� : ";
    cin >> num;

    int intNum = static_cast<int>(num);
    double douNum = num - intNum;

    cout << "���� ��Ʈ : " << intNum << endl;
    cout << "�Ҽ� ��Ʈ : " << douNum << endl;
}
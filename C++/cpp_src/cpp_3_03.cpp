#include <iostream>
#include <array>
using namespace std;

int main(){
    array<int, 5> arr;

    cout << "���� �Է� : " << endl;
    for(int a = 0; a < arr.size(); a++){
        cin >> arr.at(a);
    }
    
    cout << "�迭�� ����� ���� : ";
    for(int a = 0; a < arr.size(); a++){
        cout << arr.at(a) << " ";
    }
    cout << endl << "�迭 �������� ���� : ";
    sort(arr.begin(), arr.end());
    for(auto a : arr){
        cout << a << " ";
    }
}
#include <iostream>
#include <array>
using namespace std;

int main(){
    array<int, 5> arr;

    cout << "정수 입력 : " << endl;
    for(int a = 0; a < arr.size(); a++){
        cin >> arr.at(a);
    }
    
    cout << "배열에 저장된 내용 : ";
    for(int a = 0; a < arr.size(); a++){
        cout << arr.at(a) << " ";
    }
    cout << endl << "배열 오름차순 정렬 : ";
    sort(arr.begin(), arr.end());
    for(auto a : arr){
        cout << a << " ";
    }
}
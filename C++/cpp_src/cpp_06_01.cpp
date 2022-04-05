#include <iostream>
#include <vector>
using namespace std;


int main(){
    int arrSize;

    cout << "array size? ";
    cin >> arrSize;

    vector<double> vecArr(arrSize);

    cout << "== vector array ==" << endl;
    for(int i = 0; i < arrSize; i++){
        cout << "value? ";
        cin >> vecArr[i];
    }
    for(int i = 0; i < arrSize; i++){
        cout << "varr[" << i << "]=" << vecArr[i] << endl;
    }

    double *arr = new double[arrSize];

    cout << "== new array ==" << endl;
    for(int i = 0; i < arrSize; i++){
        cout << "value? ";
        cin >> arr[i];
    }
    for(int i = 0; i < arrSize; i ++){
        cout << "narr[" << i << "]=" << arr[i] << endl;
    }
    delete [] arr;
}
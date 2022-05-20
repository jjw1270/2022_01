#include <iostream>
#include <string>
using namespace std;

class Array{
    double *ptr;
    int size;
public:
    Array(int size);
    ~Array();
    void show(string name);
    //[]연산자 중복
    double& operator[](const int index);
    //= 연산자 중복
    Array& operator=(const Array &array);
};
Array::Array(int size){
    this -> size = size;
    this -> ptr = new double[size];
}
Array::~Array(){
    delete [] ptr;
}
void Array::show(string name){
    cout << name << " = {   ";
    for(int i = 0; i < this->size; i++){
        cout << *(ptr+i) << "   ";
    }
    cout << "}" << endl;
}

double& Array::operator[](const int index){
        if(index < 0 || index >= this->size){
            cout << "인덱스 범위 초과 오류" << endl;
            ptr = nullptr;
        }
        return *(ptr+index);
    }

Array& Array::operator=(const Array &array){
    if(this == &array) return *this;    //자기자신이면 자기자신 대입
    
    delete [] ptr;
    if(array.ptr != nullptr){
        ptr = new double[size];
        for(int i = 0; i < array.size; i++)
            *(ptr+i) = *(array.ptr+i);
    }
    else
        ptr = nullptr;
    return *this;
}

int main(){
    int size;
    cout <<"Array size? : ";
    cin >> size;

    Array arr(size), brr(size);

    for(int i = 0; i < size; i++){
        cout << i << ") input>>";
        cin >> arr[i];        //연산자중복
    }
    arr.show("arr");

    brr = arr;   //연산자 중복
    brr.show("brr");

    brr[2] = 34.5;   //연산자 중복
    brr[4] = 56.3;   //연산자 중복
    arr.show("arr");
    brr.show("brr");

    return 0;
}
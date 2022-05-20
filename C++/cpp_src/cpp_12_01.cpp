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
    //[]������ �ߺ�
    double& operator[](const int index);
    //= ������ �ߺ�
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
            cout << "�ε��� ���� �ʰ� ����" << endl;
            ptr = nullptr;
        }
        return *(ptr+index);
    }

Array& Array::operator=(const Array &array){
    if(this == &array) return *this;    //�ڱ��ڽ��̸� �ڱ��ڽ� ����
    
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
        cin >> arr[i];        //�������ߺ�
    }
    arr.show("arr");

    brr = arr;   //������ �ߺ�
    brr.show("brr");

    brr[2] = 34.5;   //������ �ߺ�
    brr[4] = 56.3;   //������ �ߺ�
    arr.show("arr");
    brr.show("brr");

    return 0;
}
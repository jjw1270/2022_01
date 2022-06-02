#include <string>
#include <iostream>
using namespace std;

template <typename T>
void reverse(T arr[], int size){
    for(int i = 0; i < size/2; i++){
        swap(arr[i], arr[size - 1 - i]);
    }
}

template <typename T>
void swap(T &first, T &second){
    T temp = first;
    first = second;
    second = temp;
}

template <typename T>
void print(string title, T arr[], int size)
{
    cout << title << " : ";
    for (int i = 0; i < size; i++)
    {
        cout << arr[i] << " ";
    }
    cout << endl;
}
int main()
{
    int arr1[] = {3, 7, 2, 12, 14, 1};
    double arr2[] = {22.7, 14.2, 3.8, 12.23, 11.2};
    char arr3[] = {'C', 'a', 'B', 'E', 'N', 'Q'};
    string arr4[] = {"John", "Lu", "Mary", "Su"};
    print("Original array", arr1, sizeof(arr1) / sizeof(int));
    reverse(arr1, sizeof(arr1) / sizeof(int));
    print("Reversed array", arr1, sizeof(arr1) / sizeof(int));
    cout << endl;
    print("Original array", arr2, sizeof(arr2) / sizeof(double));
    reverse(arr2, sizeof(arr2) / sizeof(double));
    print("Reversed array", arr2, sizeof(arr2) / sizeof(double));
    cout << endl;
    print("Original array", arr3, sizeof(arr3) / sizeof(char));
    reverse(arr3, sizeof(arr3) / sizeof(char));
    print("Reversed array", arr3, sizeof(arr3) / sizeof(char));
    cout << endl;
    print("Original array", arr4, sizeof(arr4) / sizeof(string));
    reverse(arr4, sizeof(arr4) / sizeof(string));
    print("Reversed array", arr4, sizeof(arr4) / sizeof(string));
    cout << endl;
    return 0;
}
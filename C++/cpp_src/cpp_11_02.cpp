#include <iostream>
using namespace std;

class ArrayUtil
{
public:
    // s1과 s2를 연결한 새로운 배열을 동적 생성하여 리턴
    static int *concat(int s1[], int size1, int s2[], int size2, int &retSize);
    // s1에서 s2에 있는 숫자를 모두 삭제한 새로운 배열을 동적 생성하여 리턴
    static int *remove(int s1[], int size1, int s2[], int size2, int &retSize);
};
// concat 구현합니다
//매개변수의 배열을 포인터로 구현해도 된다 (int *s1, ....)
int* ArrayUtil::concat(int s1[], int size1, int s2[], int size2, int &retSize){
    retSize = size1 + size2;
    int *p = new int[retSize];
    if(!p) return nullptr;    //포인터로 리턴하기때문
    
    for(int i = 0; i < size1; i++){
        *(p+i) = *(s1+i);
    }
    for(int i = 0; i < size2; i++){
        *(p+i+size1) = *(s2+i);
    }
    return p;
}
// remove() 구현합니다.
int* ArrayUtil::remove(int s1[], int size1, int s2[], int size2, int &retSize){
    int *p = new int[size1];  //max
    if(!p) {
        retSize = 0;
        return nullptr;
    }
    int len = 0;               //같지 않은 요소들이 몇 개인지
    for(int i = 0; i < size1; i++){
        int j;
        for(j = 0; j < size2; j++){
            if(*(s1+i) == *(s2+j))
                break;
        }
        if(j == size2) { //일치하는게 없으면 배열에 저장
            p[len] = *(s1+i);
            len++;
        }//else{ //같은 요소가 있으면 }
    }/////////////////////
    retSize = len;
    int *res = new int[retSize];
    for(int i = 0; i<retSize; i++)
        res[i] = p[i];
    delete [] p;
    return res;
}

int main()
{
    cout << "20175334 장윤제" << endl;
    int xcount = 0, ycount = 0;
    int *x, *y;

    // x배열의 원소의 개수(1~5)를 입력 받는다.
    cout << "x배열의 원소(1~5)는 몇 개 ? ";
    cin >> xcount;
    //입력 받은 수만큼 x배열을 동적 생성한다. 
    x = new int[xcount];
    //정수를 입력 받아 x배열에 저장한다.
    cout << "x배열에 저장할 변수 입력 : ";
    for(int i = 0; i < xcount; i++){
        cin >> x[i];
    }
    cout << endl;

    // y배열의 원소의 개수(1~5)를 입력 받는다. 
    cout << "y배열의 원소(1~5)는 몇 개 ? ";
    cin >> ycount;
    //입력 받은 수만큼 y배열을 동적 생성한다.
    y = new int[ycount];
    //정수를 입력 받아 y배열에 저장한다.
    cout << "y배열에 저장할 변수 입력 : ";
    for(int i = 0; i < ycount; i++){
        cin >> y[i];
    }
    cout << endl;

    int retsize = 0;

    // concat() 함수를 호출한다.
    int *conarr = ArrayUtil::concat(x, xcount, y, ycount, retsize);

    cout << "\nx배열과 y배열을 연결한 배열은 ";
    for (int i = 0; i < retsize; i++)
        cout << conarr[i] << ' ';
    cout << endl;

    // remove() 함수를 호출한다.
    int *remarr = ArrayUtil::remove(x, xcount, y, ycount, retsize);

    cout << "\nx배열에서 y배열의 원소를 삭제한 결과, x배열의 개수는 " << retsize << "개, ";
    for (int i = 0; i < retsize; i++)
        cout << remarr[i] << ' ';
    cout << endl;

    //동적 할당된 모든 변수를 해제 한다.
    delete [] x;
    delete [] y;
    delete [] conarr;
    delete [] remarr;
}
#include "randint.h"
#include <random>
#include <iostream>

using namespace std;


RandInt::RandInt(int low, int high, string cn) : objname{cn}, low{low}, high{high} {
    random_device rd;       //�õ尪�� ��� ���� random_device ����
    mt19937 gen(rd());      //random_device�� ���س��� ���� ���� �ʱ�ȭ
    uniform_int_distribution<int> dis(low, high);  //low~high ������ ���� �� ���� ����
    rannum = dis(gen);    //���� ������ �����Ͽ� ���� �� ������ ������ rannum�� ����
}
RandInt::~RandInt() {
    cout << objname << "��ü �Ҹ�" << endl;
}
void RandInt::print() const{
    cout << "Random number between " << low << " and " << high << " : " << rannum << endl;
}
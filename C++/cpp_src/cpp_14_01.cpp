#include <iostream>

using namespace std;

class BaseArray
{
    int capacity; //���� �Ҵ�� �޸��� �� �뷮
    int *mem;     //���� �Ҵ�� �޸�
protected:
    BaseArray(int capacity = 100)
    {
        this->capacity = capacity;
        mem = new int[capacity];
    }
    ~BaseArray() { delete[] mem; }
    void put(int index, int val) { mem[index] = val; }
    int get(int index) { return mem[index]; }
    int getCapacity() { return capacity; }
};
class MyQueue : public BaseArray
{
    int head; //�����͸� ���� ��ġ�� head
    int tail; //������ ������ ��ġ�� tail+1
    int size; //���� ť �ȿ� �ִ� �������� ����
public:
    MyQueue(int capacity); // capacity��ŭ BaseArray ����, head, tail, size �ʱ�ȭ
    void enqueue(int n);   //ť�� head ��ġ�� ������ �ֱ�
    int dequeue();         //ť�� tail+1 ��ġ���� �����͸� ������ ����
    int capacity();     //ť�� �� �뷮 ����
    int length();       //ť�� �ִ� �������� ���� ����
};
MyQueue::MyQueue(int capacity) : BaseArray(capacity), head{0}, tail{-1}, size{0} {};

void MyQueue::enqueue(int n){
    //put()ȣ��, head, size ����
    if(capacity() > size){
        put(head, n);
        head++;
        size++;
    }
}
int MyQueue::dequeue(){
    //get()ȣ��
    size--;
    tail++;
    return get(tail);
}
int MyQueue::capacity(){
    //getCapacity()
    return getCapacity();
}
int MyQueue::length(){
    //size ����
    return size;
}

int main()
{
    int capa;
    cout << "ť�� ��ü �뷮��? ";
    cin >> capa;
    MyQueue mq(capa);
    int cnt, n;
    cout << "ť�� ������ ���� ������? ";
    cin >> cnt;
    for (int i = 0; i < cnt; i++)
    {
        cout << i << ") ";
        cin >> n;
        mq.enqueue(n); //ť�� ������ �ֱ�
    }
    cout << "ť�� �뷮 = " << mq.capacity() << endl;
    cout << "ť�� ���� ũ�� = " << mq.length() << endl;
    cout << "ť�� ���Ҹ� ������� ���� ��� �ϸ�...";
    while (mq.length() != 0)
    {
        cout << mq.dequeue() << ' '; //ť���� ���� ���
    }
    cout << endl;
    cout << "ť�� �뷮 = " << mq.capacity() << endl;
    cout << "ť�� ���� ũ�� = " << mq.length() << endl;
}
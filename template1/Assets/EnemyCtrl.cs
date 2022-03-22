using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EnemyCtrl : MonoBehaviour
{
    private int HP = 50;
    private float moveSpeed = 2.0f;
    private float distance2Player;
    private GameObject player;
    void Start()
    {
        player = GameObject.Find("Player");
    }

    // Update is called once per frame
    void Update()
    {
        distance2Player = Vector3.Distance(this.transform.position, player.transform.position);
        if(distance2Player > 9.0f) Move();
        else StartCoroutine(Attack());
    }

    void Move(){
        this.transform.LookAt(player.transform);
        this.transform.position += transform.forward * moveSpeed * Time.deltaTime;
    }

    IEnumerator Attack(){
        yield return new WaitForSeconds(0.3f);

        Destroy(this.gameObject);
    }

    IEnumerator DelayMove(){
        float tempSpeed = moveSpeed;
        moveSpeed = 0.0f;

        yield return new WaitForSeconds(0.3f);

        moveSpeed = tempSpeed;
    }

    void OnTriggerEnter(Collider other) {
        Debug.Log("HIT");
        if(other.gameObject.CompareTag("Bullet")){
            HP -= 10;

            Destroy(other.gameObject);
            StartCoroutine(DelayMove());

            if(HP<=0) Destroy(this.gameObject);
        }
    }
}

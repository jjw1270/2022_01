using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EnemyCtrl : MonoBehaviour
{
    private int HP = 50;
    private float moveSpeed = 2.0f;
    private float distance2Player;
    private GameObject player;
    private PlayerCtrl playerState;
    private Animator anim;
    public GameObject hitEffect;
    public GameObject shotEffect;
    void Start()
    {
        player = GameObject.Find("Player");
        playerState = player.GetComponent<PlayerCtrl>();
        anim = this.GetComponent<Animator>();
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
        anim.SetBool("Shot", true);
        yield return new WaitForSeconds(1f);

        Destroy(this.gameObject);
        GameObject shot = Instantiate(shotEffect, this.transform.position, this.transform.rotation);
        Destroy(shot, 1.0f);
        playerState.HP -= 10;
        playerState.UpdateState();
    }

    IEnumerator DelayMove(){
        float tempSpeed = moveSpeed;
        anim.SetBool("Hit", true);
        moveSpeed = 0.0f;

        yield return new WaitForSeconds(0.3f);

        moveSpeed = tempSpeed;
        anim.SetBool("Hit", false);
    }

    void OnCollisionEnter(Collision other) {
        //Debug.Log("HIT");
        if(other.gameObject.CompareTag("Bullet")){
            HP -= 10;
            Destroy(other.gameObject);
            GameObject hit = Instantiate(hitEffect, other.transform.position, other.transform.rotation);
            Destroy(hit, 1.0f);
            StartCoroutine(DelayMove());

            if(HP<=0){
                Destroy(this.gameObject);
                playerState.score += 100;
                playerState.UpdateState();
            }
        }
    }
}

using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EnemySpawn : MonoBehaviour
{
    private float time = 0;
    public GameObject enemy;
    private Vector3 pos;
    private float delayTime;
    private bool isSpawn;
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        time += Time.deltaTime;

        if(time<10f){
            delayTime = 2f;
            if(!isSpawn){
                isSpawn = true;
                StartCoroutine(SpawnDelay());
            }
        }
        else if(time < 20f){
            delayTime = 1f;
            if(!isSpawn){
                isSpawn = true;
                StartCoroutine(SpawnDelay());
            }
        }
        else if(time < 30f){
            delayTime = 0.5f;
            if(!isSpawn)
                isSpawn = true;
                StartCoroutine(SpawnDelay());
        }
        else
            isSpawn = false;
            time = 0;
    }

    IEnumerator SpawnDelay(){
        pos = new Vector3(Random.Range(-15f,15f),Random.Range(-10f,10f),40);
        Instantiate(enemy, pos, enemy.transform.rotation);

        yield return new WaitForSeconds(delayTime);
        isSpawn = false;
    }
}
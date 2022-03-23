using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class PlayerCtrl : MonoBehaviour
{
    public Transform mainCam;
    public Transform firePosition;
    public GameObject bullet;
    public Text stateText;
    public int HP;
    public int score;
    public AudioClip fireSound;  //음원
    private AudioSource audioSource;  //음원 제어기

    void Start(){
        HP = 50;
        score = 0;
        UpdateState();
        audioSource = this.GetComponent<AudioSource>();
        audioSource.Play();
    }

    public void UpdateState(){
        stateText.text = " Score\n" + score + "\n" + "HP\n" + HP;
    }

    // Update is called once per frame
    void Update()
    {
        firePosition.rotation = mainCam.rotation;
        if(Input.GetMouseButtonDown(0)){
            Fire();
        }
    }

    
    void Fire(){
        Instantiate(bullet, firePosition.position, firePosition.rotation);
        audioSource.PlayOneShot(fireSound);  //다른 사운드와 별개로 플레이
    }
}

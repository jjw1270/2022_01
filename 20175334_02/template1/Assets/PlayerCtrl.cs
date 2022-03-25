using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

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
    private float time = 0;
    private float delayTime = 0.2f;
    public GameObject GameOver;

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
        time += Time.deltaTime;

        firePosition.rotation = mainCam.rotation;
        if(time >= delayTime){
            if(Input.GetMouseButtonDown(0)){
                Fire();
                time = 0;
            }
        }

        if(HP <= 0){
            Debug.Log("GAMEOVER");
            GameOver.SetActive(true);
            Invoke("loadScene", 1f);
        }
    }
    void loadScene(){
        SceneManager.LoadScene("SampleScene");
    }
    
    void Fire(){
        Instantiate(bullet, firePosition.position, firePosition.rotation);
        audioSource.PlayOneShot(fireSound);  //다른 사운드와 별개로 플레이
    }
}

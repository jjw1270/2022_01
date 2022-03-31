using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

public class PlayerCtrl : MonoBehaviour
{
    public Image cursorGameImage;
    private Vector3 screenCenter;
    private float gaugeTimer = 0.0f;
    private bool isTriggered = false;
    public Text textUI;
    public AudioClip[] soundEffects;
    private AudioClip soundEffect;
    private AudioSource audioSource;
    // Start is called before the first frame update
    void Start()
    {
        screenCenter = new Vector3(Camera.main.pixelWidth / 2, Camera.main.pixelHeight / 2);
        audioSource = this.GetComponent<AudioSource>();
    }

    // Update is called once per frame
    void Update()
    {
        Ray ray = Camera.main.ScreenPointToRay(screenCenter);
        RaycastHit hit;
        cursorGameImage.fillAmount = gaugeTimer;
        isTriggered = Input.GetMouseButtonDown(0);

        if(Physics.Raycast(ray, out hit, 100.0f)){
            if(hit.collider.GetComponent<ObjectText>().text == "Floor"){
                textUI.text = "";
                gaugeTimer = 0;
            }
            else if(hit.collider.GetComponent<ObjectText>().text == "Start"){
                if(isTriggered)
                    SceneManager.LoadScene("GameScene");
            }
            else{
                switch(hit.collider.GetComponent<ObjectText>().text){
                    case "Car" :
                        soundEffect = soundEffects[0];
                        break;
                    case "Building" :
                        soundEffect = soundEffects[1];
                        break;
                    case "Tree" :
                        soundEffect = soundEffects[2];
                        break;
                    case "Mike" :
                        soundEffect = soundEffects[3];
                        break;
                    case "Kate" :
                        soundEffect = soundEffects[4];
                        break;
                    case "Bill" :
                        soundEffect = soundEffects[5];
                        break;
                }
                gaugeTimer += 1.0f / 3.0f * Time.deltaTime;
                if(gaugeTimer >= 1.0f || isTriggered){                    
                    textUI.text = hit.collider.GetComponent<ObjectText>().text;
                    audioSource.PlayOneShot(soundEffect);
                    gaugeTimer = 0;
                    isTriggered = false;
                }
            }
        }
        else
            gaugeTimer = 0;
    }
}

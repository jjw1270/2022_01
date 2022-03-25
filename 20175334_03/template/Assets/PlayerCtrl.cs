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
            else{
                gaugeTimer += 1.0f / 3.0f * Time.deltaTime;
                if(gaugeTimer >= 1.0f || isTriggered){
                    if(hit.collider.GetComponent<ObjectText>().text == "Start"){
                        SceneManager.LoadScene("GameScene");
                    }
                    textUI.text = hit.collider.GetComponent<ObjectText>().text;
                    switch(textUI.text){
                        case "Car" :
                            audioSource.PlayOneShot(soundEffects[0]);
                            break;
                        case "Building" :
                            audioSource.PlayOneShot(soundEffects[1]);
                            break;
                        case "Tree" :
                            audioSource.PlayOneShot(soundEffects[2]);
                            break;
                        case "Mike" :
                            audioSource.PlayOneShot(soundEffects[3]);
                            break;
                        case "Kate" :
                            audioSource.PlayOneShot(soundEffects[4]);
                            break;
                        case "Bill" :
                            audioSource.PlayOneShot(soundEffects[5]);
                            break;
                    }
                    gaugeTimer = 0;
                    isTriggered = false;
                }
            }
            
        }
        else
            gaugeTimer = 0;
    }
}

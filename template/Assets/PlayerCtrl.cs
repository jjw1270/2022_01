using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class PlayerCtrl : MonoBehaviour
{
    public Image cursorGameImage;
    private Vector3 screenCenter;
    private float gaugeTimer = 0.0f;
    private bool isTriggered = false;
    public Text textUI;
    // Start is called before the first frame update
    void Start()
    {
        screenCenter = new Vector3(Camera.main.pixelWidth / 2, Camera.main.pixelHeight / 2);
    }

    // Update is called once per frame
    void Update()
    {
        Ray ray = Camera.main.ScreenPointToRay(screenCenter);
        RaycastHit hit;
        cursorGameImage.fillAmount = gaugeTimer;
        isTriggered = Input.GetMouseButtonDown(0);

        if(Physics.Raycast(ray, out hit, 100.0f)){
            gaugeTimer += 1.0f / 3.0f * Time.deltaTime;
            if(gaugeTimer >= 1.0f || isTriggered){
                textUI.text = hit.collider.GetComponent<ObjectText>().text;
                gaugeTimer = 0;
                isTriggered = false;
            }
        }
        else
            gaugeTimer = 0;
    }
}

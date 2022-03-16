using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerCtrl : MonoBehaviour
{
    public Transform mainCam;
    public Transform firePosition;

    // Update is called once per frame
    void Update()
    {
        firePosition.rotation = mainCam.rotation;
    }
}

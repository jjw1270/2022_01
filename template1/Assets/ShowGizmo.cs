using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ShowGizmo : MonoBehaviour
{

    private Color color = Color.magenta;
    private float radius = 0.5f;
    // Start is called before the first frame update
    void OnDrawGizmosSelected() {
        Gizmos.color = color;
        Gizmos.DrawSphere(this.transform.position, radius);
    }
}

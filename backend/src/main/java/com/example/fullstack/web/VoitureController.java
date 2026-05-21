package com.example.fullstack.web;

import com.example.fullstack.modele.Voiture;
import com.example.fullstack.repository.VoitureRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/voitures")
public class VoitureController {

    @Autowired
    private VoitureRepo voitureRepo;

    @GetMapping
    public Iterable<Voiture> getVoitures() {
        return voitureRepo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Voiture> getVoitureById(@PathVariable long id) {
        return voitureRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Voiture addVoiture(@RequestBody Voiture voiture) {
        return voitureRepo.save(voiture);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Voiture> updateVoiture(@PathVariable long id, @RequestBody Voiture voiture) {
        return voitureRepo.findById(id)
                .map(existing -> {
                    existing.setMarque(voiture.getMarque());
                    existing.setModele(voiture.getModele());
                    existing.setCouleur(voiture.getCouleur());
                    existing.setImmatricule(voiture.getImmatricule());
                    existing.setAnnee(voiture.getAnnee());
                    existing.setPrix(voiture.getPrix());
                    return ResponseEntity.ok(voitureRepo.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVoiture(@PathVariable long id) {
        if (!voitureRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        voitureRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

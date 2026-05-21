package com.example.fullstack.service;

import com.example.fullstack.modele.Voiture;
import com.example.fullstack.repository.VoitureRepo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.stream.StreamSupport;

@Service
public class ChatService {

    private final VoitureRepo voitureRepo;
    private final RestTemplate restTemplate;

    @Value("${groq.api-url}")
    private String groqApiUrl;

    @Value("${groq.api-key}")
    private String groqApiKey;

    @Value("${groq.model}")
    private String groqModel;

    public ChatService(VoitureRepo voitureRepo) {
        this.voitureRepo = voitureRepo;
        this.restTemplate = new RestTemplate();
    }

    @SuppressWarnings("unchecked")
    public String askAboutCars(String question) {
        if (groqApiKey == null || groqApiKey.isBlank()) {
            return "Clé API Groq non configurée. Voir le fichier .env (copier .env.example en .env et renseigner GROQ_API_KEY).";
        }

        List<Voiture> voitures = StreamSupport
                .stream(voitureRepo.findAll().spliterator(), false)
                .toList();

        StringBuilder carList = new StringBuilder();
        for (Voiture v : voitures) {
            carList.append(String.format("- %s %s, couleur: %s, immatricule: %s, année: %d, prix: %d DH%n",
                    v.getMarque(), v.getModele(), v.getCouleur(),
                    v.getImmatricule(), v.getAnnee(), v.getPrix()));
        }

        String systemPrompt = String.format(
                "Tu es un assistant pour une concession automobile appelée MIOLA Shop.%n" +
                "Voici l'inventaire actuel des voitures disponibles:%n%n%s%n" +
                "Instructions:%n" +
                "- Réponds UNIQUEMENT en français%n" +
                "- Base-toi UNIQUEMENT sur les voitures listées ci-dessus%n" +
                "- Si la question n'est pas liée aux voitures de l'inventaire, réponds poliment " +
                "que tu ne peux répondre qu'aux questions sur l'inventaire des voitures%n" +
                "- Sois concis (maximum 3-4 phrases)",
                carList.toString());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(groqApiKey);

        Map<String, Object> requestBody = Map.of(
                "model", groqModel,
                "messages", List.of(
                        Map.of("role", "system", "content", systemPrompt),
                        Map.of("role", "user", "content", question)
                ),
                "temperature", 0.3
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        Map<String, Object> response = restTemplate.postForObject(groqApiUrl, entity, Map.class);

        if (response != null) {
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
            if (choices != null && !choices.isEmpty()) {
                Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                if (message != null) {
                    return (String) message.get("content");
                }
            }
        }
        return "Désolé, je n'ai pas pu obtenir une réponse. Veuillez réessayer.";
    }
}

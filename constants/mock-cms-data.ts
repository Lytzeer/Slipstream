import { mapChampionshipLinkValueToRaw } from "@/lib/api/cms/utils/championship-link.utils";
import type { CmsArticleCategory, CmsArticleItem } from "@/lib/api/cms/controllers/articles.controller";
import type { ChampionshipRaceFeedItem } from "@/lib/api/cms/controllers/championship.controller";
import type { ChampionshipRaw } from "@/types";

const ts = (iso: string) => new Date(iso).getTime();

const elms = mapChampionshipLinkValueToRaw("ELMS") as ChampionshipRaw;
const gtWorld = mapChampionshipLinkValueToRaw("GT World") as ChampionshipRaw;
const lmc = mapChampionshipLinkValueToRaw("Le Mans Cup") as ChampionshipRaw;

export const MOCK_CHAMPIONSHIPS_CATALOG: ChampionshipRaw[] = [elms, lmc, gtWorld];

export const MOCK_ARTICLE_CATEGORIES: CmsArticleCategory[] = [
  { id: "Résultat", name: "Résultat" },
  { id: "Analyse", name: "Analyse" },
  { id: "Interview", name: "Interview" },
  { id: "Avant-course", name: "Avant-course" },
];

const BODY_HTML_ELMS_BARCELONE = `<div class="bn-block-group" data-node-type="blockGroup"><div class="bn-block-outer" data-node-type="blockOuter" data-id="19f87a9b-cae8-4e8e-9d0a-81fc12002289"><div class="bn-block" data-node-type="blockContainer" data-id="19f87a9b-cae8-4e8e-9d0a-81fc12002289"><div class="bn-block-content" data-content-type="heading"><h1 class="bn-inline-content">ELMS – Barcelone : Doriane Pin brille avec un podium remarqué aux 4 Heures</h1></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="681b4ed3-d358-4c35-bbba-f070b4295f33"><div class="bn-block" data-node-type="blockContainer" data-id="681b4ed3-d358-4c35-bbba-f070b4295f33"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content">La saison 2026 de l'European Le Mans Series a débuté sur un rythme effréné à Barcelone, et parmi les performances marquantes du week-end, celle de Doriane Pin n'est pas passée inaperçue. La Française s'est hissée sur le podium de la catégorie LMP2 Pro/Am au terme des 4 Heures de Barcelone, confirmant sa montée en puissance en endurance.</p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="765fb64a-2281-4b01-8f20-5ebe7b940074"><div class="bn-block" data-node-type="blockContainer" data-id="765fb64a-2281-4b01-8f20-5ebe7b940074"><div class="bn-block-content" data-content-type="heading" data-level="2"><h2 class="bn-inline-content">Un début de saison solide pour la Française</h2></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="02de02b3-ffe5-4303-83c9-c39a2226395b"><div class="bn-block" data-node-type="blockContainer" data-id="02de02b3-ffe5-4303-83c9-c39a2226395b"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content">Engagée avec le Duqueine Team, aux côtés de Giorgio Roda et Richard Verschoor, Doriane Pin avait pourtant parfaitement lancé son week-end en décrochant la pole position dans sa catégorie. Un signal fort dès les qualifications, illustrant le potentiel de l'équipage tricolore.</p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="cce3015c-3675-4bc9-b1b5-d07841e2a6e2"><div class="bn-block" data-node-type="blockContainer" data-id="cce3015c-3675-4bc9-b1b5-d07841e2a6e2"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content">En course, la #30 a longtemps joué les premiers rôles, se maintenant dans le groupe de tête malgré une épreuve animée et marquée par plusieurs incidents. Mais face à une concurrence particulièrement affûtée, l'équipage du Duqueine Team a dû finalement se contenter d'une place sur le podium en LMP2 Pro/Am.</p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="55864299-7ad0-44b0-8cae-0bd2c415c082"><div class="bn-block" data-node-type="blockContainer" data-id="55864299-7ad0-44b0-8cae-0bd2c415c082"><div class="bn-block-content" data-content-type="heading" data-level="2"><h2 class="bn-inline-content">Une course disputée jusqu'au bout</h2></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="95c34c3f-b30b-47dc-9633-4ee56df524a5"><div class="bn-block" data-node-type="blockContainer" data-id="95c34c3f-b30b-47dc-9633-4ee56df524a5"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content">Cette première manche de la saison ELMS a été particulièrement intense, avec une victoire arrachée dans les derniers tours par l'écurie Forestier Racing by Panis au classement général.</p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="b5ddd8f7-295a-4711-b2c9-781bdc737d8e"><div class="bn-block" data-node-type="blockContainer" data-id="b5ddd8f7-295a-4711-b2c9-781bdc737d8e"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content">Dans la catégorie LMP2 Pro/Am, la lutte a également été serrée. Malgré un rythme solide et une stratégie bien exécutée, Doriane Pin et ses coéquipiers n'ont pas pu rivaliser avec l'équipage de l'Oreca #20 d'Algarve Pro Racing, vainqueur de la catégorie.</p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="63ca12e8-0082-4aff-b699-f629a6c23aa5"><div class="bn-block" data-node-type="blockContainer" data-id="63ca12e8-0082-4aff-b699-f629a6c23aa5"><div class="bn-block-content" data-content-type="heading" data-level="2"><h2 class="bn-inline-content">Une progression constante</h2></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="1c37a6f8-6984-41d7-ac00-8ff0638f94a3"><div class="bn-block" data-node-type="blockContainer" data-id="1c37a6f8-6984-41d7-ac00-8ff0638f94a3"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content">À seulement 22 ans, Doriane Pin poursuit son ascension dans le monde de l'endurance. Déjà titrée en F1 Academy en 2025, la pilote française confirme sa polyvalence en s'illustrant désormais en prototype LMP2, une catégorie exigeante tant physiquement que stratégiquement.</p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="0de82319-adff-490a-b289-5d5f8f35254b"><div class="bn-block" data-node-type="blockContainer" data-id="0de82319-adff-490a-b289-5d5f8f35254b"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content">Ce podium à Barcelone marque un retour convaincant en ELMS pour la pilote du programme Mercedes, qui démontre sa capacité à jouer aux avant-postes dès l'entame de la saison.</p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="ed2709ff-355d-46cb-bc9c-b6525ccb02f0"><div class="bn-block" data-node-type="blockContainer" data-id="ed2709ff-355d-46cb-bc9c-b6525ccb02f0"><div class="bn-block-content" data-content-type="heading" data-level="2"><h2 class="bn-inline-content">Objectif : la victoire</h2></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="56f343bc-4233-4fbf-a89a-a5d81278beb1"><div class="bn-block" data-node-type="blockContainer" data-id="56f343bc-4233-4fbf-a89a-a5d81278beb1"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content">Si ce premier podium constitue une base solide, l'ambition est claire pour la suite du championnat : transformer ces bonnes performances en victoires. Avec une voiture compétitive et une équipe expérimentée, tous les ingrédients semblent réunis pour voir Doriane Pin s'imposer dans les mois à venir.</p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="23535034-75b2-49af-a4b2-2c5e58d826a1"><div class="bn-block" data-node-type="blockContainer" data-id="23535034-75b2-49af-a4b2-2c5e58d826a1"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content">Une chose est sûre : après Barcelone, il faudra compter sur elle dans la lutte pour le titre en LMP2 Pro/Am.</p></div></div></div></div>`;

const BODY_HTML_GTWCE_PAUL_RICARD = `<div class="bn-block-group" data-node-type="blockGroup"><div class="bn-block-outer" data-node-type="blockOuter" data-id="4956ff55-4226-4d0a-8f57-a11cdc8b32b6"><div class="bn-block" data-node-type="blockContainer" data-id="4956ff55-4226-4d0a-8f57-a11cdc8b32b6"><div class="bn-block-content" data-content-type="heading"><h1 class="bn-inline-content"><strong>GT World Challenge – Paul Ricard : Aston Martin triomphe au terme d'un final sous tension</strong></h1></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="256cf4b5-4ee0-4184-a30c-93074515461c"><div class="bn-block" data-node-type="blockContainer" data-id="256cf4b5-4ee0-4184-a30c-93074515461c"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content">La dernière manche du GT World Challenge a offert un spectacle haletant sur le circuit du Circuit Paul Ricard. Au terme de six heures de course intenses, l'équipage Comtoyou Racing s'est imposé avec Aston Martin, profitant d'un scénario totalement relancé dans les dernières minutes.</p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="a58b7421-7add-44ed-837c-e8e4965642b5"><div class="bn-block" data-node-type="blockContainer" data-id="a58b7421-7add-44ed-837c-e8e4965642b5"><div class="bn-block-content" data-content-type="heading" data-level="2"><h2 class="bn-inline-content"><strong>Un final relancé par la stratégie</strong></h2></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="deedaebd-9dc4-4393-bf03-f3bbbc13547a"><div class="bn-block" data-node-type="blockContainer" data-id="deedaebd-9dc4-4393-bf03-f3bbbc13547a"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content">Longtemps, la course semblait promise à la Mercedes-AMG Team Mann-Filter. Partie depuis la pole position, la Mercedes #48 a dominé une grande partie de l'épreuve, imposant un rythme solide et maîtrisant les différents relais.</p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="6934318d-4765-4c05-883d-e33e6f355bb5"><div class="bn-block" data-node-type="blockContainer" data-id="6934318d-4765-4c05-883d-e33e6f355bb5"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content">Mais dans le dernier relais, un Safety Car tardif est venu rebattre les cartes, regroupant l'ensemble du peloton et ouvrant la porte à un sprint final explosif. Une opportunité parfaitement exploitée par l'équipage Aston Martin.</p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="d9f60b57-5d53-4a73-90da-12127036a6c3"><div class="bn-block" data-node-type="blockContainer" data-id="d9f60b57-5d53-4a73-90da-12127036a6c3"><div class="bn-block-content" data-content-type="heading" data-level="2"><h2 class="bn-inline-content"><strong>Drudi, Sørensen et Thiim renversent la course</strong></h2></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="c36d86cf-25ba-4948-bba0-ed256114499d"><div class="bn-block" data-node-type="blockContainer" data-id="c36d86cf-25ba-4948-bba0-ed256114499d"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content">Le trio composé de Mattia Drudi, Marco Sørensen et Nicki Thiim a su tirer profit de la situation pour s'emparer de la tête dans les dernières minutes.</p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="40956dab-3d76-46ec-910f-e7c66c068ec6"><div class="bn-block" data-node-type="blockContainer" data-id="40956dab-3d76-46ec-910f-e7c66c068ec6"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content">Grâce à une stratégie efficace et une excellente gestion du trafic, l'Aston Martin Vantage GT3 Evo s'est imposée au nez et à la barbe de la Mercedes dominatrice jusque-là.</p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="85bbfbef-f13f-4c56-a6bd-793c23ec09a4"><div class="bn-block" data-node-type="blockContainer" data-id="85bbfbef-f13f-4c56-a6bd-793c23ec09a4"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content">Une victoire construite dans les derniers instants, symbole de l'imprévisibilité qui caractérise le GT World Challenge.</p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="8e4fbca1-44d6-4372-8ecf-e7ff17a5396b"><div class="bn-block" data-node-type="blockContainer" data-id="8e4fbca1-44d6-4372-8ecf-e7ff17a5396b"><div class="bn-block-content" data-content-type="heading" data-level="2"><h2 class="bn-inline-content"><strong>Une course animée dans tout le peloton</strong></h2></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="277f9715-a869-4977-836d-127523811dbc"><div class="bn-block" data-node-type="blockContainer" data-id="277f9715-a869-4977-836d-127523811dbc"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content">Derrière la lutte pour la victoire, la course a également été marquée par de nombreux rebondissements. Plusieurs équipages ont été pénalisés, bouleversant la hiérarchie et offrant un spectacle constant sur toute la durée des six heures.</p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="dcafee8c-9539-489d-8849-11fdfa43cf6d"><div class="bn-block" data-node-type="blockContainer" data-id="dcafee8c-9539-489d-8849-11fdfa43cf6d"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content">À noter également la présence de pilotes issus d'autres disciplines, preuve de l'attractivité croissante du championnat GT3, devenu une référence mondiale avec des grilles réunissant jusqu'à dix constructeurs différents.</p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="9f21b3fe-be48-4a32-b96a-98c6132021fb"><div class="bn-block" data-node-type="blockContainer" data-id="9f21b3fe-be48-4a32-b96a-98c6132021fb"><div class="bn-block-content" data-content-type="heading" data-level="2"><h2 class="bn-inline-content"><strong>Un championnat plus ouvert que jamais</strong></h2></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="36f0848a-363a-4747-a1c8-bb15d3eedf4b"><div class="bn-block" data-node-type="blockContainer" data-id="36f0848a-363a-4747-a1c8-bb15d3eedf4b"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content">Avec ce scénario renversant, cette manche au Paul Ricard confirme une tendance forte : aucune équipe ne peut se considérer à l'abri dans cette compétition ultra-serrée.</p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="57071acd-3080-49bd-9d76-62db8047f975"><div class="bn-block" data-node-type="blockContainer" data-id="57071acd-3080-49bd-9d76-62db8047f975"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content">Entre stratégie, gestion des neutralisations et performance pure, chaque détail compte. Et dans ce contexte, Aston Martin frappe fort en s'imposant face à une concurrence redoutable dès cette course clé de la saison.</p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="d13e8748-3139-4018-b2d3-1c38f86eea0b"><div class="bn-block" data-node-type="blockContainer" data-id="d13e8748-3139-4018-b2d3-1c38f86eea0b"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content">Une chose est sûre : si le reste du championnat est du même niveau, la saison 2026 du GT World Challenge promet encore de nombreux rebondissements.</p></div></div></div></div>`;

const BODY_HTML_NURBURGRING = `<div class="bn-block-group" data-node-type="blockGroup"><div class="bn-block-outer" data-node-type="blockOuter" data-id="668480d4-1ac6-4068-b523-de6e54bbb4a4"><div class="bn-block" data-node-type="blockContainer" data-id="668480d4-1ac6-4068-b523-de6e54bbb4a4"><div class="bn-block-content" data-content-type="heading"><h1 class="bn-inline-content"><strong>Nürburgring : hommage à Juha Miettinen, passionné de la Nordschleife disparu en course</strong></h1></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="20764416-4d24-44b0-b5c3-6dab2ed67e67"><div class="bn-block" data-node-type="blockContainer" data-id="20764416-4d24-44b0-b5c3-6dab2ed67e67"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content">Le sport automobile est parfois rattrapé par sa réalité la plus dure. Ce samedi, lors de la quatrième manche de la Nürburgring Langstrecken-Serie, le paddock a été plongé dans le silence après l'annonce du décès de Juha Miettinen. Un drame survenu sur l'exigeante Nordschleife, circuit aussi mythique qu'impitoyable.</p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="90480d11-3c29-49f7-9e8c-a7443d71d853"><div class="bn-block" data-node-type="blockContainer" data-id="90480d11-3c29-49f7-9e8c-a7443d71d853"><div class="bn-block-content" data-content-type="heading" data-level="2"><h2 class="bn-inline-content"><strong>Une course brutalement interrompue</strong></h2></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="f809e703-8f2f-4096-9608-222e9e466e90"><div class="bn-block" data-node-type="blockContainer" data-id="f809e703-8f2f-4096-9608-222e9e466e90"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content">L'accident s'est produit lors d'une phase de roulage marquée par des conditions de piste délicates. Plusieurs voitures ont été impliquées dans une collision en chaîne sur l'un des secteurs rapides du tracé.</p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="ace23ff4-138a-47d4-b661-05b06b8b0630"><div class="bn-block" data-node-type="blockContainer" data-id="ace23ff4-138a-47d4-b661-05b06b8b0630"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content">Malgré l'intervention rapide des équipes de secours présentes sur le circuit, Juha Miettinen n'a pas survécu à ses blessures. La direction de course a immédiatement interrompu l'épreuve, avant son annulation, laissant place à une vive émotion dans tout le paddock.</p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="d1d08e5a-abdf-4b3e-b764-1e2fafbe059d"><div class="bn-block" data-node-type="blockContainer" data-id="d1d08e5a-abdf-4b3e-b764-1e2fafbe059d"><div class="bn-block-content" data-content-type="heading" data-level="2"><h2 class="bn-inline-content"><strong>Un passionné avant tout</strong></h2></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="5ad2c04b-8241-4ee8-9ec1-b29fea1faab2"><div class="bn-block" data-node-type="blockContainer" data-id="5ad2c04b-8241-4ee8-9ec1-b29fea1faab2"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content">Âgé de 66 ans, Juha Miettinen incarnait l'esprit même de l'endurance sur la Nordschleife. Engagé en tant que gentleman driver, il faisait partie de ces passionnés qui donnent à la série son identité unique, mêlant amateurs expérimentés et professionnels.</p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="494e919f-a827-4752-b66b-f355da6bf227"><div class="bn-block" data-node-type="blockContainer" data-id="494e919f-a827-4752-b66b-f355da6bf227"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content">Au volant de sa BMW, il continuait de vivre sa passion avec intensité, sur un circuit reconnu comme l'un des plus exigeants et dangereux au monde. Sa présence en piste témoignait d'un engagement sincère, porté par l'amour de la compétition.</p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="70e821d4-7d6e-492d-b7fd-463e6b2dcc16"><div class="bn-block" data-node-type="blockContainer" data-id="70e821d4-7d6e-492d-b7fd-463e6b2dcc16"><div class="bn-block-content" data-content-type="heading" data-level="2"><h2 class="bn-inline-content"><strong>Une communauté en deuil</strong></h2></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="de9be21f-df52-430e-b3e6-b87eb4ea9689"><div class="bn-block" data-node-type="blockContainer" data-id="de9be21f-df52-430e-b3e6-b87eb4ea9689"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content">Ce drame rappelle avec brutalité les risques inhérents au sport automobile, même à une époque où la sécurité n'a jamais été aussi avancée. Sur un tracé comme la Nordschleife, long de plus de 20 kilomètres, les conditions peuvent évoluer rapidement et rendre chaque tour imprévisible.</p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="9ee6372d-a013-4395-8ac4-bc53d34787f5"><div class="bn-block" data-node-type="blockContainer" data-id="9ee6372d-a013-4395-8ac4-bc53d34787f5"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content">Dans les heures suivant l'accident, l'ensemble du paddock s'est uni dans le recueillement. Une minute de silence devrait être observée lors du prochain rassemblement de la série, en mémoire du pilote disparu.</p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="b9ec2ee1-6a7f-4cf0-8ece-1c0af33cb5bb"><div class="bn-block" data-node-type="blockContainer" data-id="b9ec2ee1-6a7f-4cf0-8ece-1c0af33cb5bb"><div class="bn-block-content" data-content-type="heading" data-level="2"><h2 class="bn-inline-content"><strong>Ne jamais oublier</strong></h2></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="f1a66f1d-5c6d-4783-b54a-68aacd28499b"><div class="bn-block" data-node-type="blockContainer" data-id="f1a66f1d-5c6d-4783-b54a-68aacd28499b"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content">Au-delà des résultats et des classements, Juha Miettinen restera comme l'un de ces passionnés qui font vivre le sport automobile dans ce qu'il a de plus pur.</p></div></div></div><div class="bn-block-outer" data-node-type="blockOuter" data-id="0539ccb1-e93d-46f9-be15-0e31e1d27014"><div class="bn-block" data-node-type="blockContainer" data-id="0539ccb1-e93d-46f9-be15-0e31e1d27014"><div class="bn-block-content" data-content-type="paragraph"><p class="bn-inline-content">Un homme qui a choisi de continuer à courir, à ressentir, à partager cette passion unique jusqu'au bout.</p></div></div></div></div>`;

export const MOCK_ARTICLES: CmsArticleItem[] = [
  {
    id: "371c4bfe-6b90-4b38-9a37-018ccca0948e",
    slug: "elms-barcelone-doriane-pin-brille-avec-un-podium-remarque-aux-4-heures",
    title: "ELMS – Barcelone : Doriane Pin brille avec un podium remarqué aux 4 Heures",
    author: "Lukas",
    imageUrl:
      "https://tqgodxkinydtrbavpjno.supabase.co/storage/v1/object/public/cms-uploads/1776418910947-aed0c4_cd49c0148be14d9f961403b122e72989-mv2.avif",
    category: "Résultat",
    championship: elms,
    publishedAt: "17 avr. 2026",
    publishedTimestamp: ts("2026-04-17"),
    readTimeMinutes: 2,
    bodyHtml: BODY_HTML_ELMS_BARCELONE,
    featured: true,
  },
  {
    id: "a0a07e29-5baa-4f94-a37c-876479bf7e32",
    slug: "gt-world-challenge-paul-ricard-aston-martin-triomphe-au-terme-d-un-final-sous-tension",
    title:
      "GT World Challenge – Paul Ricard : Aston Martin triomphe au terme d'un final sous tension",
    author: "Lukas",
    imageUrl:
      "https://tqgodxkinydtrbavpjno.supabase.co/storage/v1/object/public/cms-uploads/1776439817445-timthumb.jpeg",
    category: "Résultat",
    championship: gtWorld,
    publishedAt: "17 avr. 2026",
    publishedTimestamp: ts("2026-04-17"),
    readTimeMinutes: 2,
    bodyHtml: BODY_HTML_GTWCE_PAUL_RICARD,
  },
  {
    id: "d012a36f-1595-4975-80d4-d586d60e8cf7",
    slug: "nurburgring-hommage-a-juha-miettinen-passionne-de-la-nordschleife-disparu-en-course",
    title:
      "Nürburgring : hommage à Juha Miettinen, passionné de la Nordschleife disparu en course",
    author: "Lukas",
    imageUrl:
      "https://tqgodxkinydtrbavpjno.supabase.co/storage/v1/object/public/cms-uploads/1776601044541-52021e_c3159323f18d4a1ebaa15c8f32549cf3-mv2.avif",
    category: "Analyse",
    championship: gtWorld,
    publishedAt: "19 avr. 2026",
    publishedTimestamp: ts("2026-04-19"),
    readTimeMinutes: 2,
    bodyHtml: BODY_HTML_NURBURGRING,
  },
];

export const MOCK_UPCOMING_RACES: ChampionshipRaceFeedItem[] = [
  {
    race: { name: "4 Hours of Le Castellet", circuit: "ELMS - Paul Ricard", date: "01 mai 2026" },
    championship: elms,
    startTimestamp: ts("2026-05-01"),
    endTimestamp: ts("2026-05-03"),
  },
  {
    race: { name: "Le Castellet Round", circuit: "ELMS - Paul Ricard", date: "01 mai 2026" },
    championship: lmc,
    startTimestamp: ts("2026-05-01"),
    endTimestamp: ts("2026-05-02"),
  },
  {
    race: { name: "Brands Hatch", circuit: "Brands Hatch Grand Prix Circuit", date: "03 mai 2026" },
    championship: gtWorld,
    startTimestamp: ts("2026-05-03"),
    endTimestamp: ts("2026-05-03"),
  },
  {
    race: {
      name: "CrowdStrike 24 Hours of Spa - Prologue",
      circuit: "Circuit de Spa-Francorchamps",
      date: "19 mai 2026",
    },
    championship: gtWorld,
    startTimestamp: ts("2026-05-19"),
    endTimestamp: ts("2026-05-20"),
  },
  {
    race: { name: "Monza", circuit: "Autodromo nazionale di Monza", date: "31 mai 2026" },
    championship: gtWorld,
    startTimestamp: ts("2026-05-31"),
    endTimestamp: ts("2026-05-31"),
  },
  {
    race: {
      name: "Road To Le Mans",
      circuit: "Grand Circuit des 24 Heures du Mans",
      date: "10 juin 2026",
    },
    championship: lmc,
    startTimestamp: ts("2026-06-10"),
    endTimestamp: ts("2026-06-12"),
  },
  {
    race: {
      name: "CrowdStrike 24 Hours of Spa",
      circuit: "Circuit de Spa-Francorchamps",
      date: "25 juin 2026",
    },
    championship: gtWorld,
    startTimestamp: ts("2026-06-25"),
    endTimestamp: ts("2026-06-28"),
  },
  {
    race: { name: "4 Hours of Imola", circuit: "ELMS - Imola", date: "03 juil. 2026" },
    championship: elms,
    startTimestamp: ts("2026-07-03"),
    endTimestamp: ts("2026-07-05"),
  },
  {
    race: {
      name: "Misano",
      circuit: "Misano World Circuit Marco Simoncelli",
      date: "17 juil. 2026",
    },
    championship: gtWorld,
    startTimestamp: ts("2026-07-17"),
    endTimestamp: ts("2026-07-19"),
  },
  {
    race: { name: "Magny-Cours", circuit: "Circuit de Nevers Magny-Cours", date: "31 juil. 2026" },
    championship: gtWorld,
    startTimestamp: ts("2026-07-31"),
    endTimestamp: ts("2026-08-02"),
  },
  {
    race: {
      name: "4 Hours of Spa-Francorchamps",
      circuit: "WEC - Spa-Francorchamps",
      date: "21 août 2026",
    },
    championship: elms,
    startTimestamp: ts("2026-08-21"),
    endTimestamp: ts("2026-08-23"),
  },
  {
    race: {
      name: "Spa-Francorchamps Round",
      circuit: "WEC - Spa-Francorchamps",
      date: "21 août 2026",
    },
    championship: lmc,
    startTimestamp: ts("2026-08-21"),
    endTimestamp: ts("2026-08-22"),
  },
  {
    race: {
      name: "Nürburgring",
      circuit: "Nürburgring Grand Prix Streck",
      date: "28 août 2026",
    },
    championship: gtWorld,
    startTimestamp: ts("2026-08-28"),
    endTimestamp: ts("2026-08-30"),
  },
  {
    race: {
      name: "Goodyear 4 Hours of Silverstone",
      circuit: "WEC - Silverstone - Circuit Grand Prix",
      date: "11 sept. 2026",
    },
    championship: elms,
    startTimestamp: ts("2026-09-11"),
    endTimestamp: ts("2026-09-13"),
  },
  {
    race: {
      name: "Silverstone Round",
      circuit: "WEC - Silverstone - Circuit Grand Prix",
      date: "11 sept. 2026",
    },
    championship: lmc,
    startTimestamp: ts("2026-09-11"),
    endTimestamp: ts("2026-09-12"),
  },
  {
    race: { name: "Zandvoort", circuit: "Circuit Zandvoort", date: "18 sept. 2026" },
    championship: gtWorld,
    startTimestamp: ts("2026-09-18"),
    endTimestamp: ts("2026-09-20"),
  },
  {
    race: {
      name: "Barcelona",
      circuit: "Circuit de Barcelona-Catalunya",
      date: "02 oct. 2026",
    },
    championship: gtWorld,
    startTimestamp: ts("2026-10-02"),
    endTimestamp: ts("2026-10-04"),
  },
  {
    race: {
      name: "4 Hours of Portimão",
      circuit: "ELMS - Autódromo Internacional do Algarve",
      date: "08 oct. 2026",
    },
    championship: elms,
    startTimestamp: ts("2026-10-08"),
    endTimestamp: ts("2026-10-10"),
  },
  {
    race: {
      name: "Portimão Round",
      circuit: "ELMS - Autódromo Internacional do Algarve",
      date: "08 oct. 2026",
    },
    championship: lmc,
    startTimestamp: ts("2026-10-08"),
    endTimestamp: ts("2026-10-10"),
  },
  {
    race: {
      name: "Portimão",
      circuit: "Autódromo Internacional do Algarve",
      date: "16 oct. 2026",
    },
    championship: gtWorld,
    startTimestamp: ts("2026-10-16"),
    endTimestamp: ts("2026-10-18"),
  },
];

export const MOCK_PAST_RACES: ChampionshipRaceFeedItem[] = [
  {
    race: { name: "4 Hours of Barcelona", circuit: "Barcelona", date: "10 avr. 2026" },
    championship: elms,
    startTimestamp: ts("2026-04-10"),
    endTimestamp: ts("2026-04-12"),
  },
  {
    race: { name: "Barcelona Round", circuit: "Barcelona", date: "10 avr. 2026" },
    championship: lmc,
    startTimestamp: ts("2026-04-10"),
    endTimestamp: ts("2026-04-11"),
  },
  {
    race: { name: "Circuit Paul Ricard", circuit: "Circuit Paul Ricard", date: "11 avr. 2026" },
    championship: gtWorld,
    startTimestamp: ts("2026-04-11"),
    endTimestamp: ts("2026-04-11"),
  },
];

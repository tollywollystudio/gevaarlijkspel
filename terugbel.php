<?php
// Terugbelverzoek van gevaarlijkspel.nl: stuurt een mail naar het team.
header('Content-Type: application/json; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['ok' => false]); exit; }
// Lokveld: mensen zien dit veld niet, robots vullen het in.
if (!empty($_POST['website'])) { echo json_encode(['ok' => true]); exit; }

function veld($naam, $max) {
    $v = isset($_POST[$naam]) ? trim((string)$_POST[$naam]) : '';
    $v = str_replace(["\r", "\n"], ' ', $v);
    return mb_substr($v, 0, $max);
}
$naam = veld('naam', 100);
$org = veld('org', 150);
$tel = veld('tel', 40);
$wanneer = veld('wanneer', 150);
if ($naam === '' || $tel === '' || !preg_match('/^[0-9 +()\-]{6,40}$/', $tel)) {
    http_response_code(422); echo json_encode(['ok' => false]); exit;
}
$aan = 'wouter@tollywollystudio.nl';
$onderwerp = 'Terugbelverzoek Gevaarlijk spel: ' . $naam;
$tekst = "Terugbelverzoek via gevaarlijkspel.nl\n\n"
       . "Naam: $naam\nOrganisatie: $org\nTelefoon: $tel\nWanneer schikt het: $wanneer\n";
$host = preg_replace('/[^a-z0-9.\-]/i', '', $_SERVER['HTTP_HOST'] ?? 'gevaarlijkspel.nl');
$host = preg_replace('/^www\./', '', $host);
$kop = "From: Gevaarlijk spel <noreply@$host>\r\nContent-Type: text/plain; charset=utf-8";
$ok = mail($aan, '=?UTF-8?B?' . base64_encode($onderwerp) . '?=', $tekst, $kop);
if (!$ok) { http_response_code(500); }
echo json_encode(['ok' => (bool)$ok]);
